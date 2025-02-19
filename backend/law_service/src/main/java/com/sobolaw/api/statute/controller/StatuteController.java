package com.sobolaw.api.statute.controller;

import com.sobolaw.api.common.response.BaseResponse;
import com.sobolaw.api.precedent.dto.PrecedentDTO;
import com.sobolaw.api.statute.dto.StatuteDTO;
import com.sobolaw.api.statute.service.StatuteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/statutes")
@Tag(name = "StatuteController", description = "법령 관련 기능")
@RequiredArgsConstructor
public class StatuteController {

    private final StatuteService statuteService;

    @GetMapping("/search/{searchKeyword}")
    @Operation(
        summary = "법령 검색",
        description = "키워드를 사용하여 법령명, 조문내용, 조문서브내용 컬럼을 검색합니다."
    )
    public BaseResponse<List<StatuteDTO>> searchStatutes(
            @PathVariable String searchKeyword,
            @RequestParam(defaultValue = "1") int pageNumber) throws Exception {
        List<StatuteDTO> searchResults = statuteService.searchByKeyword(searchKeyword, pageNumber);
        if (searchResults.isEmpty()) {
            return BaseResponse.success(HttpStatus.OK.value(), "법령 검색 결과가 없습니다.", searchResults);
        }
        return BaseResponse.success(HttpStatus.OK.value(), "법령 검색 성공!", searchResults);
    }

    @GetMapping("/detail/{statuteNumber}")
    @Operation(summary = "법령 내용 조회", description = "statuteNumber로 법령 내용 조회")
    public BaseResponse<StatuteDTO> getStatuteDetail (@PathVariable Long statuteNumber) {
        StatuteDTO precedent = statuteService.getStatuteByNumber(statuteNumber);
        return BaseResponse.success(HttpStatus.OK.value(), "법령 상세 조회 성공!", precedent);
    }

    @GetMapping("/list")
    @Operation(summary = "법령 순위 목록 조회", description = "법령을 조회수 높은 순으로 20개 반환")
    public BaseResponse<?> getStatuteOrderByHitDesc() {
        List<StatuteDTO> statutes = statuteService.findTop20ByOrderByHitDesc();
        return BaseResponse.success(HttpStatus.OK.value(), "법령 순위 조회 성공!", statutes);
    }

}