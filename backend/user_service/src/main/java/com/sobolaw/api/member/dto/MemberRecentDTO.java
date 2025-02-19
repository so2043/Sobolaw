package com.sobolaw.api.member.dto;

import com.sobolaw.api.member.entity.MemberRecent;
import java.io.Serializable;

/**
 * DTO for {@link MemberRecent}.
 */
public record MemberRecentDTO(Long recentPrecedentId, Long memberId, Long precedentId) implements Serializable {

    public static MemberRecentDTO of(Long recentPrecedentId, Long memberId, Long precedentId) {
        return new MemberRecentDTO(recentPrecedentId, memberId, precedentId);
    }

    /**
     * MemberRecent 엔터티를 MemberRecentDTO로 변환하는 메소드.
     */
    public static MemberRecentDTO from(MemberRecent entity) {
        return new MemberRecentDTO(entity.getRecentPrecedentId(), entity.getMember().getMemberId(), // Member 엔터티를 MemberDTO로 변환 후 memberId GET
            entity.getPrecedentId());
    }

    /**
     * MemberRecentDTO를 MemberRecent 엔터티로 변환하는 메소드.
     */
    public static MemberRecent toEntity(MemberRecentDTO dto) {
        return MemberRecent.of(dto.precedentId());
    }

}